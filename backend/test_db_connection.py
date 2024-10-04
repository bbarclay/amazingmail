import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database connection details from environment variables
DATABASE_URL = os.getenv("POSTGRES_URL")

def test_connection():
    try:
        # Connect to the database
        connection = psycopg2.connect(DATABASE_URL)
        cursor = connection.cursor()

        # Create a test table
        cursor.execute("CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(50));")
        connection.commit()

        # Print success message
        print("Connected to the database and created test_table successfully.")

    except Exception as error:
        print(f"Error connecting to the database: {error}")

    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    test_connection()
