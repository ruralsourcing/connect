import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Select, Rate } from "antd";
import { Tech } from "@prisma/client";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_SKILLS = gql`
  {
    skills {
      technology {
        name
      }
      rating
    }
  }
`;

// const GET_TECH = gql`
//   query technologies {
//     id
//     name
//   }
// `;

const ADD_SKILL = gql`
  mutation addSkill($technologyId: Int!, $rating: Int!) {
    addSkill(skill: { technologyId: $technologyId, rating: $rating }) {
      id
      rating
      Tech {
        id
        name
      }
    }
  }
`;

const Skills = () => {
  const [tech, setTech] = useState<Tech[]>();
  // const [skills, setSkills] = useState<Skill[]>();
  const { loading, error, data, refetch } = useQuery(GET_SKILLS);
  const [addSkill, { loading: adding, error: addError }] = useMutation(
    ADD_SKILL
  );

  useEffect(() => {
    axios.get("/api/tech").then((tech) => {
      setTech(tech.data);
    });
  }, []);

  return (
    <>
      <h1>Skills</h1>
      <Form
        onFinish={(data) => {
          console.log(data);
          addSkill({
            variables: {
              technologyId: data.techId,
              rating: data.rating,
            },
          }).then((result) => {
              console.log(result);
              refetch();
          });
        }}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
      >
        <Form.Item name="techId" label="Technology">
          <Select disabled={!tech}>
            {tech &&
              tech.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="rating" label="Rating">
          <Rate count={10} defaultValue={5} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {(loading && <div>Loading...</div>) ||
        (error && <div>Error! ${error.message}`</div>) ||
        (data &&
          data.skills.map(
            (skill: {
              rating: number;
              technology: {
                name: string;
              };
            }, idx: string) => (
              <div key={idx}>
                User Skill {skill.technology?.name} with rating {skill.rating}
              </div>
            )
          ))}
    </>
  );
};

export default Skills;
