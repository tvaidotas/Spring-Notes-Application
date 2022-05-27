# Example application for handling notes

Basic CRUD functionality with H2 in-memory database

## Pre-requisites

* Maven
* Java
* Tomcat

## Running instructions

1. Clone the repository
2. Open a terminal within the repository directory
3. Execute the following command
```shell
mvn clean package
```
4. Copy the .war file from the /target directory to tomcats webapps directory
5. Check whether the application was deployed successfully

## Testing instructions
1. Install browser drivers to use Selenium. Please follow https://www.selenium.dev/documentation/webdriver/getting_started/install_drivers/ 
2. Copy static files from src/main/java/com/qa/views to src/main/resources/public
3. Start Spring Boot App
4. Open a terminal within the repository directory
5. Execute the following command
```shell
mvn test
```
5. Check whether the tests were successfull