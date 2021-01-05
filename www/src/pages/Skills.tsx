import React from "react";
import AddSkill from "../components/Skills/AddSkill";
import Skills from "../components/Skills/Skills";

const SkillsPage = () => {
  //const [tech, setTech] = useState<Tech[]>();
  // const [skills, setSkills] = useState<Skill[]>();
  //const { loading, error, data, refetch } = useQuery(GET_SKILLS);
  // const [addSkill, { loading: adding, error: addError }] = useMutation(
  //   ADD_SKILL
  // );

  // useEffect(() => {
  //   axios.get("/api/tech").then((tech) => {
  //     setTech(tech.data);
  //   });
  // }, []);

  return (
    <>
      <h1>Skills</h1>
      <AddSkill />
      <Skills />
    </>
  );
};

export default SkillsPage;
