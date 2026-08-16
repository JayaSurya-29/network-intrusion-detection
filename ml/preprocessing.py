import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder

COLUMN_NAMES = [
    'duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
    'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins', 'logged_in',
    'num_compromised', 'root_shell', 'su_attempted', 'num_root', 'num_file_creations',
    'num_shells', 'num_access_files', 'num_outbound_cmds', 'is_host_login',
    'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate',
    'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate',
    'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count',
    'dst_host_same_srv_rate', 'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate',
    'dst_host_srv_diff_host_rate', 'dst_host_serror_rate', 'dst_host_srv_serror_rate',
    'dst_host_rerror_rate', 'dst_host_srv_rerror_rate', 'label', 'difficulty_level'
]

CATEGORICAL_FEATURES = ['protocol_type', 'service', 'flag']

NUMERICAL_FEATURES = [
    'duration', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent', 'hot',
    'num_failed_logins', 'logged_in', 'num_compromised', 'root_shell', 'su_attempted',
    'num_root', 'num_file_creations', 'num_shells', 'num_access_files', 'num_outbound_cmds',
    'is_host_login', 'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate',
    'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate', 'srv_diff_host_rate',
    'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate', 'dst_host_diff_srv_rate',
    'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate', 'dst_host_serror_rate',
    'dst_host_srv_serror_rate', 'dst_host_rerror_rate', 'dst_host_srv_rerror_rate'
]

ATTACK_MAP = {
    'normal': 'Normal',
    # DoS
    'neptune': 'DoS', 'back': 'DoS', 'land': 'DoS', 'pod': 'DoS', 'smurf': 'DoS', 'teardrop': 'DoS',
    'mailbomb': 'DoS', 'apache2': 'DoS', 'processtable': 'DoS', 'udpstorm': 'DoS',
    # Probe
    'ipsweep': 'Probe', 'nmap': 'Probe', 'portsweep': 'Probe', 'satan': 'Probe', 'mscan': 'Probe', 'saint': 'Probe',
    # R2L
    'ftp_write': 'R2L', 'guess_passwd': 'R2L', 'imap': 'R2L', 'multihop': 'R2L', 'phf': 'R2L',
    'spy': 'R2L', 'warezclient': 'R2L', 'warezmaster': 'R2L', 'sendmail': 'R2L', 'named': 'R2L',
    'snmpgetattack': 'R2L', 'snmpguess': 'R2L', 'xlock': 'R2L', 'xsnoop': 'R2L', 'worm': 'R2L',
    # U2R
    'buffer_overflow': 'U2R', 'loadmodule': 'U2R', 'perl': 'U2R', 'rootkit': 'U2R',
    'httptunnel': 'U2R', 'ps': 'U2R', 'xterm': 'U2R', 'sqlattack': 'U2R'
}

TARGET_CLASSES = ['Normal', 'DoS', 'Probe', 'R2L', 'U2R']

class NetworkDataPreprocessor:
    def __init__(self):
        self.encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.label_encoder.fit(TARGET_CLASSES)
        self.is_fitted = False
        
    def map_attack_category(self, label_series: pd.Series) -> pd.Series:
        """Map fine-grained NSL-KDD attack labels to 5 core categories."""
        return label_series.map(lambda x: ATTACK_MAP.get(str(x).strip().lower(), 'DoS'))

    def fit(self, df: pd.DataFrame):
        """Fit preprocessor strictly on training features to avoid data leakage."""
        cat_data = df[CATEGORICAL_FEATURES]
        num_data = df[NUMERICAL_FEATURES]
        
        self.encoder.fit(cat_data)
        self.scaler.fit(num_data)
        self.is_fitted = True
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """Transform features using fitted encoder and scaler."""
        if not self.is_fitted:
            raise ValueError("Preprocessor has not been fitted yet. Call fit() first.")
        
        cat_data = df[CATEGORICAL_FEATURES]
        num_data = df[NUMERICAL_FEATURES]
        
        cat_encoded = self.encoder.transform(cat_data)
        num_scaled = self.scaler.transform(num_data)
        
        return np.hstack([num_scaled, cat_encoded])

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        """Fit on training data and return transformed feature matrix."""
        self.fit(df)
        return self.transform(df)

    def encode_target(self, y_raw: pd.Series) -> np.ndarray:
        """Map raw labels to 5 categories and encode as numeric labels."""
        y_mapped = self.map_attack_category(y_raw)
        return self.label_encoder.transform(y_mapped)

    def decode_target(self, y_encoded: np.ndarray) -> np.ndarray:
        """Decode numeric predictions back to class names."""
        return self.label_encoder.inverse_transform(y_encoded)

    def transform_single(self, raw_dict: dict) -> np.ndarray:
        """Transform a single sample dictionary (API input) to model-ready array."""
        sample_df = pd.DataFrame([raw_dict])
        
        # Ensure missing numerical features default to 0
        for col in NUMERICAL_FEATURES:
            if col not in sample_df.columns:
                sample_df[col] = 0
                
        # Ensure missing categorical features default to common baseline
        if 'protocol_type' not in sample_df.columns:
            sample_df['protocol_type'] = 'tcp'
        if 'service' not in sample_df.columns:
            sample_df['service'] = 'http'
        if 'flag' not in sample_df.columns:
            sample_df['flag'] = 'SF'

        return self.transform(sample_df)

    def save(self, filepath: str):
        """Save preprocessor state using joblib."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self, filepath)
        print(f"Saved preprocessor state to {filepath}")

    @classmethod
    def load(cls, filepath: str) -> "NetworkDataPreprocessor":
        """Load preprocessor state using joblib."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Preprocessor file not found at {filepath}")
        preprocessor = joblib.load(filepath)
        return preprocessor


def prepare_data(data_dir=None):
    """Load train/test data, fit preprocessor on train only, return processed matrices."""
    if data_dir is None:
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        
    train_path = os.path.join(data_dir, 'KDDTrain+.txt')
    test_path = os.path.join(data_dir, 'KDDTest+.txt')
    
    train_df = pd.read_csv(train_path, names=COLUMN_NAMES)
    test_df = pd.read_csv(test_path, names=COLUMN_NAMES)
    
    preprocessor = NetworkDataPreprocessor()
    
    # Fit strictly on train to avoid data leakage
    X_train = preprocessor.fit_transform(train_df)
    y_train = preprocessor.encode_target(train_df['label'])
    
    # Transform test set using fitted preprocessor
    X_test = preprocessor.transform(test_df)
    y_test = preprocessor.encode_target(test_df['label'])
    
    saved_models_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    preprocessor_path = os.path.join(saved_models_dir, 'preprocessor.joblib')
    preprocessor.save(preprocessor_path)
    
    return X_train, y_train, X_test, y_test, preprocessor

if __name__ == "__main__":
    X_tr, y_tr, X_te, y_te, prep = prepare_data()
    print(f"Data Preparation Complete!")
    print(f"X_train shape: {X_tr.shape}, y_train shape: {y_tr.shape}")
    print(f"X_test shape: {X_te.shape}, y_test shape: {y_te.shape}")
    print(f"Classes: {prep.label_encoder.classes_}")
