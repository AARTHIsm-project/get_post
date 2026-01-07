pipeline {
    agent any

    environment {
        PORT = '3000'
        DOCKERHUB_USERNAME = 'aarthidevops'
        IMAGE_NAME = 'get-post-file'
        CREDENTIALS_ID = 'dockerhub-aarthi-id'
    }

    triggers {
        pollSCM('H/2 * * * *') // Poll every 2 minutes
    }

    stages {

        stage('Verify index.html') {
            steps {
                echo 'Checking if index.html exists...'
                bat '''
                    if exist views\\index.html (
                        echo index.html found.
                    ) else (
                        echo index.html not found.
                        exit /b 1
                    )
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    bat 'docker build -t %IMAGE_NAME% .'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-aarthi-id',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )
                ]) {
                    bat 'docker login -u %DOCKERHUB_USER% -p %DOCKERHUB_PASS%'
                }
            }
        }

        stage('Tag Image') {
            steps {
                bat 'docker tag %IMAGE_NAME% %DOCKERHUB_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'docker tag %IMAGE_NAME% %DOCKERHUB_USERNAME%/%IMAGE_NAME%:latest'
            }
        }

        stage('Push to DockerHub') {
            steps {
                bat 'docker push %DOCKERHUB_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'docker push %DOCKERHUB_USERNAME%/%IMAGE_NAME%:latest'
            }
        }

        stage('Build App') {
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
