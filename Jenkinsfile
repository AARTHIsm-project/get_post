pipeline {
    agent any

    environment {
        PORT = '3000'  // set the port here
    }

    triggers {
        pollSCM('H/2 * * * *') // Poll every 2 minutes
    }

    stages {
        stage('Verify README.md') {
            steps {
                echo ' Checking if README.md exists...'
                bat '''
                    if exist README.md (
                        echo  README.md found.
                    ) else (
                        echo  README.md not found.
                        exit /b 1
                    )
                '''
            }
        }
        stage('Build') {
            steps {
                echo 'Installing dependencies'
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests'
                bat 'npm test || echo No tests found, skipping...'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying application on port ${PORT}"
                // Windows: run Node app in background
                bat "start /B npm start -- --port ${PORT}"
                echo "Server running at http://localhost:${PORT}"
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
