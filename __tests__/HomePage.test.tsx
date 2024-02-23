import {render, waitFor, screen} from '@testing-library/react';
import Home from '@/app/page';
import ApiConnector from '@/app/services/ApiConnector';

 
// Mocking ApiConnector
// jest.mock('@/app/services/ApiConnector', () => ({
//   getInstance: jest.fn(() => ({
//     getCurrentUserFromSession: jest.fn(() => Promise.resolve({ name: 'John Doe' })),
//   })),
// }));

describe('Home Component', () => {
  it('renders loading state correctly', async () => {
    render(<Home searchParams={{}} />);
    expect(screen.getByText(/Harvesting local/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Hello Guest/)).toBeInTheDocument());
  });

  

  // You can write more test cases for other functionalities of your component
});
