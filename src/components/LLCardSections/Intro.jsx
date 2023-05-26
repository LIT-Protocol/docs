import React from "react";
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from "../HomepageComponents";

export default function IntroSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Intro to Lit"
        description="Learn about Lit Protocol's functionalities around access control, encryption, and programmatic signing."
        to="/learningLab/introToLit/intro"
      />
    </Section>
  );
}
