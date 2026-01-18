pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'aarthidevops'
        IMAGE_NAME = 'get-post-file'
        CREDENTIALS_ID = 'dockerhub-aarthi-id'
        SONAR_TOKEN_ID = 'sonar-token-id'
        SONAR_PROJECT_KEY = 'get-post-file'
        SONAR_HOST_NAME = 'MySonarQubeServer'  // Name configured in Jenkins SonarQube settings
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONAR_HOST_NAME}") {
                    // Run SonarQube scanner for general projects (JS, Python, etc.)
                    bat """
                    sonar-scanner ^
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=%SONAR_HOST_URL% ^
                        -Dsonar.login=%SONAR_AUTH_TOKEN%
                    """
                }
            }
        }

        stage('Quality Gate Check') {
            steps {
                // Wait for SonarQube analysis and fail pipeline if quality gate fails
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% -f Dockerfile .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${CREDENTIALS_ID}",
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    bat 'echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin'
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                bat 'docker tag %IMAGE_NAME% %DOCKERHUB_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'docker tag %IMAGE_NAME% %DOCKERHUB_USERNAME%/%IMAGE_NAME%:latest'
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                bat 'docker push %DOCKERHUB_USERNAME%/%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'docker push %DOCKERHUB_USERNAME%/%IMAGE_NAME%:latest'
            }
        }

        stage('Deploy Pod & Service to Kubernetes') {
            steps {
                bat '''
                kubectl config use-context minikube
                kubectl delete pod getpost-pod --ignore-not-found
                kubectl apply -f pod.yaml --validate=false
                kubectl apply -f service.yaml --validate=false
                kubectl get pods
                kubectl get svc
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully with SonarQube quality checks.'
        }
        failure {
            echo 'Pipeline failed due to build or SonarQube quality gate failure.'
        }
    }
}
