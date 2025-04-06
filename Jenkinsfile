pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // Jenkins secret ID
        DOCKER_IMAGE = "your-dockerhub-username/your-nodejs-app"
        SONARQUBE_ENV = 'SonarQube' // Jenkins SonarQube name
    }

    tools {
        nodejs "NodeJS" // Set in Global Tool Config
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/your-user/your-nodejs-app.git', branch: 'master'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Code Quality Check - SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh 'npx sonar-scanner'
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $DOCKER_IMAGE:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                        sh "docker push $DOCKER_IMAGE:${env.BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    sh '''
                        git clone https://github.com/your-user/your-k8s-manifests.git
                        cd your-k8s-manifests
                        sed -i "s|image: .*|image: $DOCKER_IMAGE:${BUILD_NUMBER}|" deployment.yaml
                        git config user.email "ci@example.com"
                        git config user.name "CI Bot"
                        git commit -am "Update image to build ${BUILD_NUMBER}"
                        git push https://<your-git-token>@github.com/your-user/your-k8s-manifests.git
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
