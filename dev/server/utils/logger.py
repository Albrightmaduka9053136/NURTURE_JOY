import logging
import os

def setup_logger(name="nurturejoy"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        # Create logs directory if it doesn't exist
        log_dir = os.path.join(os.getcwd(), "logs")

        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

        log_file = os.path.join(log_dir, "app.log")

        file_handler = logging.FileHandler(log_file)

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger