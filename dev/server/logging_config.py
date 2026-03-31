import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logging():
    log_dir = os.getenv("LOG_DIR", "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level, logging.INFO))

    # avoid duplicate handlers on reload
    if root_logger.handlers:
        for h in list(root_logger.handlers):
            root_logger.removeHandler(h)

    file_handler = RotatingFileHandler(
        os.path.join(log_dir, "app.log"), maxBytes=1_000_000, backupCount=3
    )
    file_handler.setLevel(getattr(logging, log_level, logging.INFO))
    file_handler.setFormatter(formatter)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, log_level, logging.INFO))
    console_handler.setFormatter(formatter)

    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    chat_logger = logging.getLogger("nurturejoy.chat")
    chat_handler = RotatingFileHandler(
        os.path.join(log_dir, "chat.log"), maxBytes=1_000_000, backupCount=2
    )
    chat_handler.setLevel(getattr(logging, log_level, logging.INFO))
    chat_handler.setFormatter(formatter)
    chat_logger.addHandler(chat_handler)
    chat_logger.setLevel(getattr(logging, log_level, logging.INFO))
    chat_logger.propagate = True

    logging.getLogger(__name__).info("Logging initialized")
