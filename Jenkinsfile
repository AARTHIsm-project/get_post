pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'aarthidevops'
        IMAGE_NAME = 'get-post-file'
        CREDENTIALS_ID = 'dockerhub-aarthi-id'
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

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% -f Dockerfile .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${CREDENTIALS_ID}",
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )
                ]) {
                    bat 'docker login -u %DOCKERHUB_USER% -p %DOCKERHUB_PASS%'
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
            echo 'Jenkins → Docker → Kubernetes pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
