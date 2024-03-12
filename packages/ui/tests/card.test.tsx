import { render, screen } from '@testing-library/react';

import { Card } from '../src/card';

describe('App', () => {
  it('renders headline', () => {
    render(<Card>Test</Card>);

    screen.debug();
  });
});
