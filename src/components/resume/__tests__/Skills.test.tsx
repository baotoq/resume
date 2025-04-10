import { render, screen } from '@testing-library/react';
import { Skills } from '../Skills';
import { SkillCategory } from '@/types/resume';

// Mock Ant Design components
jest.mock('antd', () => ({
  Card: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="ant-card">
      <div data-testid="ant-card-title">{title}</div>
      {children}
    </div>
  ),
  List: Object.assign(
    ({ dataSource, renderItem }: {
      dataSource: string[];
      renderItem: (item: string) => React.ReactNode
    }) => (
      <ul data-testid="ant-list">
        {dataSource.map((item, index) => (
          <li key={index} data-testid="ant-list-item">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    ),
    { Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }
  ),
  Typography: {
    Title: ({ children, level }: { children: React.ReactNode; level: number }) => (
      <h2 data-testid="ant-typography-title" data-level={level}>
        {children}
      </h2>
    ),
  },
}));

describe('Skills', () => {
  const mockSkillCategories: SkillCategory[] = [
    {
      title: 'Programming Languages',
      skills: ['JavaScript', 'TypeScript', 'Python'],
    },
    {
      title: 'Frameworks',
      skills: ['React', 'Next.js', 'Node.js'],
    },
  ];

  it('renders the skills title', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    const title = screen.getByTestId('ant-typography-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Skills');
    expect(title).toHaveAttribute('data-level', '2');
  });

  it('renders all skill categories', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    const cards = screen.getAllByTestId('ant-card');
    expect(cards).toHaveLength(mockSkillCategories.length);
  });

  it('renders category titles correctly', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    const cardTitles = screen.getAllByTestId('ant-card-title');
    expect(cardTitles[0]).toHaveTextContent('Programming Languages');
    expect(cardTitles[1]).toHaveTextContent('Frameworks');
  });

  it('renders all skills in each category', () => {
    render(<Skills skillCategories={mockSkillCategories} />);
    const listItems = screen.getAllByTestId('ant-list-item');

    // Check first category skills
    expect(listItems[0]).toHaveTextContent('JavaScript');
    expect(listItems[1]).toHaveTextContent('TypeScript');
    expect(listItems[2]).toHaveTextContent('Python');

    // Check second category skills
    expect(listItems[3]).toHaveTextContent('React');
    expect(listItems[4]).toHaveTextContent('Next.js');
    expect(listItems[5]).toHaveTextContent('Node.js');
  });

  it('renders empty state when no categories are provided', () => {
    render(<Skills skillCategories={[]} />);
    const cards = screen.queryAllByTestId('ant-card');
    expect(cards).toHaveLength(0);
  });
});
