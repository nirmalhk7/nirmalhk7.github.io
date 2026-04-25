import React from 'react';
import { render, screen } from '@testing-library/react';
import Jumbotron from '../elements/jumbotron';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />; // Mock next/image to standard img for testing
  },
}));

describe('Jumbotron Component', () => {
  it('renders Max Jumbotron correctly', () => {
    render(
      <Jumbotron.Max
        orangeText="Hello World"
        HeadingTextComponent={<h1>Main Title</h1>}
        buttonDetails={[['Click Me', '#click']]}
        bgImg={{ src: '/test.jpg', height: 100, width: 100 } as any}
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Main Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click Me' })).toBeInTheDocument();
  });
});
