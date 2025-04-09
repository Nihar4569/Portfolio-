import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px; // Default padding for desktop
  
  @media (max-width: 768px) {
    padding-top: 70px; // Adjusted padding for mobile
  }
`;

// You can add other shared styled components here