import os
import pandas as pd

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

def inspect_dataset():
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    train_path = os.path.join(data_dir, 'KDDTrain+.txt')
    
    if not os.path.exists(train_path):
        print(f"Error: {train_path} does not exist.")
        return

    df = pd.read_csv(train_path, names=COLUMN_NAMES)
    
    print("=== NSL-KDD DATASET INSPECTION ===")
    print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    print("\n--- Missing Values ---")
    print(f"Total Missing Values: {df.isnull().sum().sum()}")
    print("\n--- Duplicate Records ---")
    print(f"Duplicate Rows: {df.duplicated().sum()}")
    
    categorical_cols = ['protocol_type', 'service', 'flag']
    numerical_cols = [c for c in COLUMN_NAMES if c not in categorical_cols + ['label', 'difficulty_level']]
    
    print(f"\nCategorical Columns ({len(categorical_cols)}): {categorical_cols}")
    print(f"Numerical Columns ({len(numerical_cols)}): {numerical_cols[:5]} ... (total {len(numerical_cols)})")
    print(f"Target Column: 'label'")
    
    # Class mapping & distribution
    df['attack_category'] = df['label'].map(lambda x: ATTACK_MAP.get(x, 'Attack'))
    
    print("\n--- Raw Label Distribution (Top 10) ---")
    print(df['label'].value_counts().head(10))
    
    print("\n--- Mapped 5-Class Distribution ---")
    print(df['attack_category'].value_counts())
    print("\n==================================")

if __name__ == "__main__":
    inspect_dataset()
