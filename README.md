# Nearfarm: Harvesting Local Goodness For You
![NearFarm Logo](public/assets/logos/app/full-logo.png)

**Nearfarm** is a web application designed to revolutionize the local food ecosystem. It bridges the gap between consumers seeking fresh, locally sourced produce and local farmers struggling to reach a wider audience. By providing a user-friendly online marketplace, Nearfarm empowers small-scale farmers and individuals with surplus produce to sell directly to consumers, fostering a more sustainable and equitable food system.

## Key Features

- **User-Friendly Interface:** Nearfarm boasts an intuitive interface for easy navigation and product listing, ensuring a seamless user experience.
- **Direct Transactions:** Nearfarm enables direct transactions between farmers and consumers, fostering transparency and trust.
- **Empowerment of Farmers:** Small-scale farmers can reach a wider audience and sell their products professionally, breaking free from reliance on intermediary companies.
- **Surplus Produce Sales:** Individuals with surplus produce from personal gardens can conveniently list and sell their goods on the platform.
- **Fully Mobile Responsive:** Nearfarm is designed to be fully responsive on mobile devices, ensuring an optimal experience for users across all screen sizes.
- **Integration with Third-Party Authentication Services:** Nearfarm integrates with third-party authentication services such as Google and GitHub, providing users with seamless login options.
- **Continuous Integration and Deployment:** New code is merged into the integration branch and subsequently deployed to the main branch for releases. Vercel bot automates specific tasks, ensuring smooth operations.
- **Testing:** Frontend unit tests are conducted using Jest, while backend automation testing is performed with Postman.

## Technology Stack

* **Frontend:** NextJs (app router)
* **Backend:** NodeJs
* **Hosting:** Vercel
* **Database:** MongoDB
* **Authentication:** NextAuth.js
* **Frontend Unit Testing:** Jest
* **Backend Automation Testing:** Postman
* **API Requests:** Axios
* **UI Component Library:** shadcn/ui and Tailwind CSS
* **Form Handling:** React Hook Form
* **Other Dependencies:** Refer to `package.json` for a complete list (additional dependencies like email sending libraries, date pickers, etc.)

## Development Workflow

* **Integration Branch:** All new code is initially merged into the `integration` branch for rigorous testing.
* **Main Branch:** Code is merged into the `main` branch upon successful release.
* **Vercel Bot:** Automates specific tasks to streamline deployment and maintenance processes.

## Testing

Nearfarm utilizes both frontend unit tests and backend automation testing to ensure reliability and functionality.

**Integration Branch:** [![Build Pipeline](https://github.com/vaibhavthapliyalx/NearFarm/actions/workflows/build-test.yml/badge.svg?branch=integration)](https://github.com/vaibhavthapliyalx/NearFarm/actions/workflows/build-test.yml)

**Main Branch:**
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
**Production Build:** [Visit now!](https://near-farm.vercel.app)


### Deployment Process

Vercel's bot triggers the deployment process upon detecting new code changes pushed to the GitHub repository. The changes are then automatically built and deployed to the production environment on Vercel.

## Project Status

This project is currently a work in progress. Developed as a Final Year Project at Ulster University, it is actively being developed to become the leading platform for connecting local farmers and consumers. I am continuously working on enhancing its features and functionality to provide a seamless experience for users.

## Disclaimer

Nearfarm is a Final Year project developed by Vaibhav Thapliyal. All rights to the codebase, including but not limited to its design, implementation, and associated documentation, are reserved.
Any third-party services, libraries, or tools used in this project are the respective properties of their owners and may be protected by trademarks, copyrights, or other intellectual property rights. They are subject to their own terms and licenses.

## Open Issues and Suggestions

We welcome any suggestions or feedback to improve Nearfarm. Feel free to open an issue if you encounter any bugs, have ideas for new features, or would like to suggest improvements to the existing functionality. Your input is valuable in shaping the future development of Nearfarm.

To open an issue, please follow these steps:
1. Navigate to the [Issues](<https://github.com/vaibhavthapliyalx/NearFarm/issues>) tab of the repository.
2. Click on the "New Issue" button.
3. Provide a descriptive title and detailed description of the issue or suggestion.
4. Assign appropriate labels and milestones if applicable.
5. Submit the issue.

## License

This project is licensed under the MIT Licence - see the [LICENSE](LICENSE.md) file for details.
