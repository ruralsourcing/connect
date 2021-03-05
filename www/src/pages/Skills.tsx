import React from "react";
import AddSkill from "../components/Skills/AddSkill";
import Skills from "../components/Skills/Skills";
import { Typography } from '@material-ui/core';

const SkillsPage = () => {
  return (
    <>
      <Typography variant={"h2"}>Skills</Typography>
      <AddSkill />
      <Skills />
    </>
  );
};

export default SkillsPage;
