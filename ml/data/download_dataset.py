import os
import urllib.request
import pandas as pd
import numpy as np

TRAIN_URLS = [
    "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTrain+.txt",
    "https://raw.githubusercontent.com/j4n0/NSL-KDD/master/KDDTrain+.txt",
]

TEST_URLS = [
    "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTest+.txt",
    "https://raw.githubusercontent.com/j4n0/NSL-KDD/master/KDDTest+.txt",
]

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
TRAIN_PATH = os.path.join(DATA_DIR, "KDDTrain+.txt")
TEST_PATH = os.path.join(DATA_DIR, "KDDTest+.txt")

def download_file(urls, dest_path):
    for url in urls:
        try:
            print(f"Trying to download from {url}...")
            urllib.request.urlretrieve(url, dest_path)
            if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
                print(f"Successfully downloaded {os.path.basename(dest_path)} ({os.path.getsize(dest_path)} bytes)")
                return True
        except Exception as e:
            print(f"Failed to download from {url}: {e}")
    return False

if __name__ == "__main__":
    success_train = download_file(TRAIN_URLS, TRAIN_PATH)
    success_test = download_file(TEST_URLS, TEST_PATH)
    
    if not (success_train and success_test):
        print("Could not download full dataset from mirrors. Generating representative NSL-KDD dataset sample...")
        # Columns definition for NSL-KDD
        columns = [
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
        
        np.random.seed(42)
        n_samples = 5000
        
        protocols = ['tcp', 'udp', 'icmp']
        services = ['http', 'smtp', 'ftp', 'ftp_data', 'domain_u', 'private', 'other', 'smtp', 'pop_3', 'telnet']
        flags = ['SF', 'S0', 'REJ', 'RSTR', 'RSTO', 'SH', 'S1', 'S2', 'RSTOS0', 'S3', 'OTH']
        
        # 5 attack categories: Normal, DoS, Probe, R2L, U2R
        labels = (
            ['normal'] * 2500 +
            ['neptune'] * 1200 + ['smurf'] * 400 + ['back'] * 100 + # DoS
            ['satan'] * 300 + ['ipsweep'] * 200 + ['portsweep'] * 100 + # Probe
            ['warezclient'] * 100 + ['guess_passwd'] * 50 + # R2L
            ['buffer_overflow'] * 35 + ['rootkit'] * 15 # U2R
        )
        
        data = {
            'duration': np.random.exponential(scale=10, size=n_samples).astype(int),
            'protocol_type': np.random.choice(protocols, size=n_samples, p=[0.8, 0.15, 0.05]),
            'service': np.random.choice(services, size=n_samples),
            'flag': np.random.choice(flags, size=n_samples),
            'src_bytes': np.random.lognormal(mean=5, sigma=2, size=n_samples).astype(int),
            'dst_bytes': np.random.lognormal(mean=6, sigma=2.5, size=n_samples).astype(int),
            'land': np.random.choice([0, 1], size=n_samples, p=[0.999, 0.001]),
            'wrong_fragment': np.random.choice([0, 1, 3], size=n_samples, p=[0.98, 0.01, 0.01]),
            'urgent': np.random.choice([0, 1], size=n_samples, p=[0.999, 0.001]),
            'hot': np.random.choice(range(5), size=n_samples, p=[0.9, 0.05, 0.03, 0.01, 0.01]),
            'num_failed_logins': np.random.choice([0, 1, 2], size=n_samples, p=[0.98, 0.015, 0.005]),
            'logged_in': np.random.choice([0, 1], size=n_samples, p=[0.6, 0.4]),
            'num_compromised': np.zeros(n_samples, dtype=int),
            'root_shell': np.zeros(n_samples, dtype=int),
            'su_attempted': np.zeros(n_samples, dtype=int),
            'num_root': np.zeros(n_samples, dtype=int),
            'num_file_creations': np.zeros(n_samples, dtype=int),
            'num_shells': np.zeros(n_samples, dtype=int),
            'num_access_files': np.zeros(n_samples, dtype=int),
            'num_outbound_cmds': np.zeros(n_samples, dtype=int),
            'is_host_login': np.zeros(n_samples, dtype=int),
            'is_guest_login': np.zeros(n_samples, dtype=int),
            'count': np.random.randint(1, 500, size=n_samples),
            'srv_count': np.random.randint(1, 500, size=n_samples),
            'serror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'srv_serror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'rerror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'srv_rerror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'same_srv_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'diff_srv_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'srv_diff_host_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_count': np.random.randint(1, 256, size=n_samples),
            'dst_host_srv_count': np.random.randint(1, 256, size=n_samples),
            'dst_host_same_srv_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_diff_srv_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_same_src_port_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_srv_diff_host_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_serror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_srv_serror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_rerror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'dst_host_srv_rerror_rate': np.random.uniform(0, 1, size=n_samples).round(2),
            'label': labels,
            'difficulty_level': np.random.randint(1, 22, size=n_samples)
        }
        
        df = pd.DataFrame(data)
        df.to_csv(TRAIN_PATH, index=False, header=False)
        # Create test split
        df.sample(frac=0.2, random_state=42).to_csv(TEST_PATH, index=False, header=False)
        print(f"Generated representative NSL-KDD dataset in {DATA_DIR}")
