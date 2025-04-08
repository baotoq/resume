import { contactInfo, education, experiences, projects, skillCategories } from '../resume';

describe('Resume Data', () => {
  describe('contactInfo', () => {
    it('has all required fields', () => {
      expect(contactInfo).toEqual(
        expect.objectContaining({
          email: expect.any(String),
          phone: expect.any(String),
          location: expect.any(String),
          linkedin: expect.any(String),
          github: expect.any(String),
        })
      );
    });
  });

  describe('experiences', () => {
    it('has valid experience entries', () => {
      expect(experiences.length).toBeGreaterThan(0);
      experiences.forEach(exp => {
        expect(exp).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            company: expect.any(String),
            period: expect.any(String),
            achievements: expect.arrayContaining([expect.any(String)]),
          })
        );
      });
    });
  });

  describe('education', () => {
    it('has valid education entries', () => {
      expect(education.length).toBeGreaterThan(0);
      education.forEach(edu => {
        expect(edu).toEqual(
          expect.objectContaining({
            degree: expect.any(String),
            school: expect.any(String),
            period: expect.any(String),
          })
        );
      });
    });
  });

  describe('skillCategories', () => {
    it('has valid skill categories', () => {
      expect(skillCategories.length).toBeGreaterThan(0);
      skillCategories.forEach(category => {
        expect(category).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            skills: expect.arrayContaining([expect.any(String)]),
          })
        );
      });
    });
  });

  describe('projects', () => {
    it('has valid project entries', () => {
      expect(projects.length).toBeGreaterThan(0);
      projects.forEach(project => {
        expect(project).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            technologies: expect.any(String),
            achievements: expect.arrayContaining([expect.any(String)]),
          })
        );
      });
    });
  });
});
