# 80 Viva Preparation Questions & Answers
## AI-Powered Network Intrusion Detection & Threat Monitoring System

---

### SECTION A: 30 BASIC VIVA QUESTIONS & ANSWERS

1. **What is an Intrusion Detection System (IDS)?**  
   *Answer*: An IDS is a security system that monitors network traffic for suspicious activity or policy violations and alerts network administrators.

2. **What is the difference between NIDS and HIDS?**  
   *Answer*: Network IDS (NIDS) monitors traffic across an entire network segment, while Host IDS (HIDS) monitors activity on a single host computer.

3. **What is the NSL-KDD dataset?**  
   *Answer*: It is an improved version of the KDD'99 network intrusion dataset that eliminates duplicate records to prevent machine learning model bias.

4. **What are the 5 main traffic categories in NSL-KDD?**  
   *Answer*: Normal, DoS (Denial of Service), Probe (Surveillance), R2L (Remote to Local), and U2R (User to Root).

5. **What is Machine Learning in Cybersecurity?**  
   *Answer*: Using statistical algorithms to learn patterns from historical network data to automatically classify threats or detect anomalies.

6. **What is Supervised Learning?**  
   *Answer*: Machine learning where models are trained on labeled data (input features with target labels).

7. **What is Unsupervised Learning?**  
   *Answer*: Machine learning where models discover hidden patterns in unlabeled data without target ground-truth labels.

8. **What is a Feature Vector?**  
   *Answer*: A numerical vector representation of network packet attributes (e.g., duration, protocol, packet bytes).

9. **What is Data Leakage?**  
   *Answer*: When information from outside the training dataset (such as test set statistics) is accidentally used during model training.

10. **What is Overfitting?**  
    *Answer*: When a model learns training data noise perfectly but fails to generalize to unseen test data.

11. **What is Underfitting?**  
    *Answer*: When a model is too simple to capture patterns in both training and testing datasets.

12. **What is Precision?**  
    *Answer*: The percentage of predicted attacks that were actual genuine attacks ($\frac{TP}{TP + FP}$).

13. **What is Recall (Sensitivity)?**  
    *Answer*: The percentage of actual attacks that were correctly detected by the model ($\frac{TP}{TP + FN}$).

14. **What is F1-Score?**  
    *Answer*: The harmonic mean of Precision and Recall ($2 \times \frac{Precision \times Recall}{Precision + Recall}$).

15. **What is a Confusion Matrix?**  
    *Answer*: A tabular visualization comparing true labels against model predicted labels across all classes.

16. **What is a False Positive (FP)?**  
    *Answer*: When normal, safe traffic is incorrectly flagged as an attack.

17. **What is a False Negative (FN)?**  
    *Answer*: When an actual attack bypasses detection and is incorrectly marked as normal.

18. **Why is a False Negative worse than a False Positive in cybersecurity?**  
    *Answer*: A false negative allows an attacker inside the system undetected, while a false positive only wastes analyst time.

19. **What is FastAPI?**  
    *Answer*: A modern, fast Python web framework for building REST APIs with automatic data validation.

20. **What is Uvicorn?**  
    *Answer*: An Asynchronous Server Gateway Interface (ASGI) web server used to run FastAPI applications.

21. **What is Pydantic?**  
    *Answer*: A Python library used by FastAPI for data validation and settings management using Python type hints.

22. **What is React?**  
    *Answer*: A popular JavaScript component-based library for building interactive user interfaces.

23. **What is Vite?**  
    *Answer*: A lightning-fast frontend build tool and development server for modern web applications.

24. **What is SQLite?**  
    *Answer*: A lightweight, serverless, self-contained SQL database engine.

25. **What is REST API?**  
    *Answer*: Representational State Transfer — an architectural style for client-server communication using HTTP requests.

26. **What is CORS?**  
    *Answer*: Cross-Origin Resource Sharing — a browser security mechanism allowing frontend applications on one port to request data from backends on another port.

27. **What is One-Hot Encoding?**  
    *Answer*: Converting categorical variables (e.g. `tcp`, `udp`) into binary 0/1 columns.

28. **What is Feature Scaling (StandardScaler)?**  
    *Answer*: Standardizing numerical features so they have a mean of 0 and variance of 1.

29. **What is Joblib?**  
    *Answer*: A Python library used for serializing and saving trained machine learning models to disk.

30. **What is an Alert in an IDS?**  
    *Answer*: A notification generated when traffic risk exceeds acceptable safety thresholds.

---

### SECTION B: 30 TECHNICAL VIVA QUESTIONS & ANSWERS

31. **Why was Random Forest chosen over Decision Tree?**  
    *Answer*: Random Forest builds an ensemble of decision trees, reducing variance and overfitting while handling non-linear feature interactions significantly better.

32. **How does Isolation Forest work?**  
    *Answer*: It isolates anomalous data points by randomly selecting features and splitting values. Anomalies require fewer splits (shorter path lengths) to isolate than normal points.

33. **What is the decision function in Isolation Forest?**  
    *Answer*: A numerical score indicating how easily a point was isolated. Negative scores indicate anomalies; positive scores indicate normal baseline traffic.

34. **What is the hyperparameter `contamination` in Isolation Forest?**  
    *Answer*: The expected proportion of outliers/anomalies in the dataset used to set the decision boundary threshold.

35. **Why use `handle_unknown='ignore'` in OneHotEncoder?**  
    *Answer*: To prevent real-time prediction crashes when previously unseen service names or protocol types appear in production traffic.

36. **How do you handle class imbalance in NSL-KDD?**  
    *Answer*: By configuring `class_weight='balanced'` in classifier models and prioritizing Weighted/Macro F1-Score over raw accuracy.

37. **Why was Logistic Regression with SGD used for baseline comparison?**  
    *Answer*: Stochastic Gradient Descent (SGD) allows fast linear classification on large 122-dimensional feature matrices.

38. **What is the difference between `fit()` and `transform()` in Scikit-Learn?**  
    *Answer*: `fit()` calculates transformation parameters (mean, std, categories) on training data; `transform()` applies those parameters to data.

39. **Why is `fit_transform()` only called on training data?**  
    *Answer*: Calling `fit` on test data leaks test set statistics into the preprocessor, violating model evaluation integrity.

40. **How does FastAPI handle concurrent requests?**  
    *Answer*: Through Python `asyncio` event loops and asynchronous worker execution.

41. **What is SQLAlchemy ORM?**  
    *Answer*: Object-Relational Mapping library that converts Python class models into SQL database queries automatically.

42. **Why set `check_same_thread=False` in SQLite?**  
    *Answer*: SQLite by default restricts connections to a single thread. FastAPI handles requests asynchronously across threads, requiring multi-thread permission.

43. **How does Pydantic validate incoming traffic feature payloads?**  
    *Answer*: By enforcing strict type checking, bounds (`ge=0`), and default value fallbacks on JSON bodies before reaching route logic.

44. **What is the purpose of `saved_models/preprocessor.joblib`?**  
    *Answer*: It stores the exact fitted state of OneHotEncoder and StandardScaler to ensure consistent column ordering and scaling during API inference.

45. **How are HTTP status codes used in the backend?**  
    *Answer*: `200 OK` for success, `404 Not Found` for missing resources, `422 Unprocessable Entity` for validation errors, and `500 Internal Server Error` for exceptions.

46. **What is Recharts?**  
    *Answer*: A composable SVG-based React chart library used for rendering real-time dashboard visualizations.

47. **How does `useEffect` work in the React Dashboard?**  
    *Answer*: It triggers initial data fetching (`apiService.getStatistics()`) upon component mount.

48. **How does the frontend handle API network failures?**  
    *Answer*: Through central `try/catch` error handling in `api.js` returning user-friendly error banners without crashing the component tree.

49. **What is the purpose of `LabelEncoder` in target mapping?**  
    *Answer*: Converts string categories (`Normal`, `DoS`, `Probe`, `R2L`, `U2R`) into integers `[0, 1, 2, 3, 4]` for classifier training.

50. **How do fine-grained attack types map to 5 core categories?**  
    *Answer*: Using a static dictionary mapping (`neptune` $\rightarrow$ `DoS`, `satan` $\rightarrow$ `Probe`, `warezclient` $\rightarrow$ `R2L`, `buffer_overflow` $\rightarrow$ `U2R`).

51. **What is `src_bytes` and `dst_bytes` in NSL-KDD?**  
    *Answer*: Number of data bytes transferred from source host to destination host and vice-versa.

52. **What is `same_srv_rate`?**  
    *Answer*: The percentage of connections to the same service within a given time window.

53. **What is `serror_rate`?**  
    *Answer*: The percentage of connections that activated "SYN" errors (indicative of SYN Flood DoS attacks).

54. **What is the purpose of `predict_proba` in Scikit-Learn?**  
    *Answer*: Returns calibrated class probability distributions for computing prediction confidence scores.

55. **How does the Singleton pattern optimize prediction inference?**  
    *Answer*: Models are loaded into memory once (`get_predictor()`), avoiding expensive `.joblib` disk reads on every REST request.

56. **What is the difference between synchronous and asynchronous code in Python?**  
    *Answer*: Synchronous code blocks execution until task completion; asynchronous code allows non-blocking task execution.

57. **What is the role of `vite.config.js`?**  
    *Answer*: Configures Vite development server settings, React plugins, and port bindings.

58. **Why are Lucide Icons used in the dashboard?**  
    *Answer*: High-performance lightweight SVG icons for clean cybersecurity status indicators.

59. **How is alert status updated in SQLite?**  
    *Answer*: Via `PATCH /alerts/{id}/resolve` query executing an `UPDATE alerts SET status='Resolved'` statement.

60. **What is the difference between `GET` and `POST` HTTP methods?**  
    *Answer*: `GET` retrieves data without side-effects; `POST` sends payload data to be processed or stored.

---

### SECTION C: 20 PROJECT-SPECIFIC VIVA QUESTIONS & ANSWERS

61. **What is the core title and objective of your project?**  
    *Answer*: AI-Powered Network Intrusion Detection & Threat Monitoring System — combining supervised ML classification and unsupervised anomaly detection to monitor and explain network threats.

62. **What dataset did you use for training?**  
    *Answer*: The benchmark NSL-KDD dataset comprising 125,973 training records and 22,544 test records across 41 network features.

63. **Which classifier achieved the best performance in your experiments?**  
    *Answer*: Random Forest Classifier with 75.20% accuracy and 81.02% weighted precision.

64. **What precision did your model achieve for DoS attack detection?**  
    *Answer*: 96% precision ($0.96$).

65. **What anomaly detection rate did Isolation Forest achieve on Probe attacks?**  
    *Answer*: 97.03% detection rate.

66. **How does your system determine the Risk Level (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)?**  
    *Answer*: By combining the classifier label with the Isolation Forest anomaly flag (e.g., DoS + Anomaly = `CRITICAL`, Normal + Anomaly = `HIGH`).

67. **How does your backend prevent exposing raw internal Python stack traces?**  
    *Answer*: Through a global exception handler `@app.exception_handler(Exception)` in `main.py` returning sanitized JSON errors.

68. **Where are trained machine learning model artifacts saved?**  
    *Answer*: In `ml/saved_models/` (`preprocessor.joblib`, `classifier.joblib`, `anomaly_detector.joblib`).

69. **Where is SQLite database data stored?**  
    *Answer*: In `database/network_ids.db`.

70. **What happens when a user clicks "Analyze Traffic" in the React frontend?**  
    *Answer*: The frontend sends a `POST /predict` request to FastAPI, which runs `predict_network_traffic()`, stores logs in SQLite, triggers an alert if severe, and returns structured JSON to render in UI.

71. **What preset test signatures are built into your Traffic Analyzer?**  
    *Answer*: Normal HTTP, DoS Neptune Attack, Probe Portscan, and Anomalous Burst Traffic.

72. **How does the system notify analysts of security incidents?**  
    *Answer*: High/Critical threats automatically generate an entry in the SQLite `alerts` table and display as active alerts in the Threat Alerts tab.

73. **Can an analyst resolve an alert from the dashboard?**  
    *Answer*: Yes, clicking "Mark Resolved" sends a `PATCH /alerts/{id}/resolve` request updating SQLite status.

74. **What visualization charts are implemented in your dashboard?**  
    *Answer*: Donut Pie Chart for Attack Distribution and Bar Chart for Attack Frequency using Recharts.

75. **How did you prevent data leakage during preprocessing?**  
    *Answer*: `NetworkDataPreprocessor.fit()` was executed strictly on `KDDTrain+.txt` and saved; test samples were transformed using the saved preprocessor.

76. **Why did you use both Logistic Regression, Decision Tree, and Random Forest?**  
    *Answer*: To conduct a rigorous baseline empirical comparative study as required by academic standards.

77. **What is the false positive rate of your Isolation Forest model on normal traffic?**  
    *Answer*: 6.62% baseline false positive rate.

78. **How is system health monitored in real-time?**  
    *Answer*: Via `GET /health` endpoint checking ML status, Anomaly model status, and SQLite connection.

79. **What are the limitations of this project?**  
    *Answer*: NSL-KDD is a static benchmark dataset; real-world modern networks feature encrypted HTTPS/TLS payload traffic requiring flow inspection.

80. **What is the future scope of this project?**  
    *Answer*: Integrating live PCAP packet capture (using Scapy/DPKT), Deep Learning (LSTM/Autoencoders), and automated IP firewall blocking.
