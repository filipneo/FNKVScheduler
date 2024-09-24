
# FNKV Scheduler

**Overview**

The FNKV Scheduler application is a comprehensive solution designed to streamline service scheduling in healthcare environments. Developed with simplicity and efficiency in mind, this application offers a user-friendly interface and a wide range of features to enhance scheduling processes. 

**Features**

- **User-Friendly Interface:** The application boasts a clear and intuitive graphical interface, making service scheduling efficient and accessible to all staff members.

- **Next.js Framework:** The user application is built using the Next.js framework, ensuring robust performance and seamless user experience.

- **Web API with ASP.NET Core:** Utilizing Web API with ASP.NET Core ensures smooth communication between the front-end and back-end components of the application.

- **Containerized Deployment:** Docker technology is employed to containerize the entire application, facilitating easy deployment across various environments.

- **Workplace and Employee Management:** The application allows for the management of workplaces and employees, providing administrators with comprehensive control over staffing resources.

- **Vacation Management:** Staff vacation scheduling is integrated into the system, simplifying the process of tracking and managing employee leave.

- **Service Scheduling Automation:** Partial automation of service scheduling enhances efficiency, reducing manual workload and ensuring optimal allocation of resources.

## Prerequisites
- Installed Git 
- Installed Docker

## Getting the Source Code
- Clone the repository
- Ensure the presence of the following in the root directory:
  - `docker-compose.yml`
  - `Frontend` folder
  - `API` folder
  - `Database` folder

## Configuration Changes
Small adjustments of configuration files to match your environment for successful and secure deployment.

### Docker Compose Configuration
Adjust the values of these paramaters in `docker-compose.yml` to your preferences

**Database Container:**
- Change `MYSQL_ROOT_PASSWORD` value to a secure password.

**API Container:**
- Change `Pwd` value in the environment section to a secure password.

### Database Configuration
 - Update the password in `Database/01_create_user.sql` to match the new password set in `docker-compose.yml` API container.

### Frontend Configuration
- Modify the `.env.production` file located in the `Frontend` directory.
- Update the domain of the URL to the server's address instead of the local environment.

## Running the Application
- Execute `docker-compose up -d` in the root directory to build and start the application.

## Stopping the Application
- Execute `docker-compose down` to stop the application.
