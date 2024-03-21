# Nearfarm: Connecting Consumers with Local Farmers
![NearFarm Logo](public/assets/full-logo.png)

**Nearfarm** is a web application designed to revolutionize the local food ecosystem. It bridges the gap between consumers seeking fresh, locally sourced produce and local farmers struggling to reach a wider audience. By providing a user-friendly online marketplace, Nearfarm empowers small-scale farmers and individuals with surplus produce to sell directly to consumers, fostering a more sustainable and equitable food system.

## Key Features

* **Seamless Marketplace:** Connects consumers with local farmers for convenient online shopping.
* **Direct Farmer-Consumer Interaction:** Farmers control their pricing and establish direct customer relationships.
* **Accessibility:** Caters to both professional farmers and individuals with homegrown produce.
* **Fresh and Local Produce:** Promotes healthy eating habits by providing fresh, locally sourced food.

## Technology Stack

* **Frontend:** NextJs (app router)
* **Backend:** NodeJs
* **Hosting:** Vercel
* **Database:** MongoDB
* **Authentication:** NextAuth.js
* **Frontend Unit Testing:** Jest
* **Backend Automation Testing:** Postman
* **API Requests:** Axios
* **UI Component Library:** ShadCN and Tailwind CSS
* **Form Handling:** React Hook Form
* **Other Dependencies:** Refer to `package.json` for a complete list (additional dependencies like email sending libraries, date pickers, etc.)

## Development Workflow

* **Integration Branch:** All new code is initially merged into the `integration` branch for rigorous testing.
* **Main Branch:** Code is merged into the `main` branch upon successful release.
* **Vercel Bot:** Automates specific tasks to streamline deployment and maintenance processes.

## Testing

Nearfarm utilizes both frontend unit tests and backend automation testing to ensure reliability and functionality.

** Integration Branch:** [![Build Pipeline](https://github.com/vaibhavthapliyalx/NearFarm/actions/workflows/build-test.yml/badge.svg?branch=integration)](https://github.com/vaibhavthapliyalx/NearFarm/actions/workflows/build-test.yml)

** Main Branch:**
[![Build Pipeline](https://github.com/vaibhavthapliyalx/NearFarm/actions/workflows/build-test.yml/badge.svg?branch=main)](https://github.com/vaibhavthapliyalx/NearFarm/actions/workflows/build-test.yml)

### Frontend Unit Tests

Frontend unit tests are implemented using Jest. To run the frontend unit tests, use the following command:

```bash
npm test
```

## How to Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/vaibhavthapliyalx/NearFarm.git
    cd nearfarm
    ```
2. Install dependencies for both frontend and backend:

    ```bash
    npm install
    ```

3. Configure environment variables and start the development server:

    ```bash
    npm run dev
    ```

Visit [http://localhost:3000](http://localhost:3000) to explore the application.

## Deployment

Nearfarm utilizes Vercel for seamless deployment and hosting. The deployment process is automated through Vercel's integration with GitHub.

### Deployment Process

Vercel's bot triggers the deployment process upon detecting new code changes pushed to the GitHub repository. The changes are then automatically built and deployed to the production environment on Vercel.

## Project Status

This project is currently a work in progress. Developed as a Final Year Project at Ulster University, it is actively being developed to become the leading platform for connecting local farmers and consumers. I am continuously working on enhancing its features and functionality to provide a seamless experience for users.

## Disclaimer

Nearfarm is a Final Year project developed by Vaibhav Thapliyal. All rights to the codebase, including but not limited to its design, implementation, and associated documentation, are reserved. Any unauthorized use, reproduction, or distribution of the codebase or its components is strictly prohibited. The project maintainers and contributors disclaim any liability for any issues, damages, or legal consequences arising from the unauthorized use or distribution of Nearfarm. 
Any third-party services, libraries, or tools used in this project are the respective properties of their owners and may be protected by trademarks, copyrights, or other intellectual property rights. They are subject to their own terms and licenses.


## Open Issues and Suggestions

We welcome any suggestions or feedback to improve Nearfarm. Feel free to open an issue if you encounter any bugs, have ideas for new features, or would like to suggest improvements to the existing functionality. Your input is valuable in shaping the future development of Nearfarm.

To open an issue, please follow these steps:
1. Navigate to the [Issues](<https://github.com/vaibhavthapliyalx/NearFarm/issues>) tab of the repository.
2. Click on the "New Issue" button.
3. Provide a descriptive title and detailed description of the issue or suggestion.
4. Assign appropriate labels and milestones if applicable.
5. Submit the issue.

Thank you for contributing to Nearfarm! 

## License

This project is proprietary and currently not licensed for public use. All rights to the codebase are reserved by the project owner. Unauthorized use, reproduction, or distribution of the code is strictly prohibited. If you wish to use or modify the codebase, please contact the project owner for permission.
