import React from 'react';
import { CoursePart } from '../types';
import Part from './Part';

const Content = ({ courses }: { courses: Array<CoursePart> }) => (
  <div>
    {courses.map(c => 
      <Part key={c.name} part={c} />
    )}

  </div>
);

export default Content;
