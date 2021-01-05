import { gql, useMutation } from "@apollo/client";
import { Tech } from "@prisma/client";
import { Button, Form, Rate, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

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

const AddSkill = () => {
  const [tech, setTech] = useState<Tech[]>();

  const [addSkill, { loading: adding, error: addError }] = useMutation(
    ADD_SKILL
  );

  useEffect(() => {
    axios.get("/api/tech").then((tech) => {
      setTech(tech.data);
    });
  }, []);

  return (
    <Form
      onFinish={(data) => {
        console.log(data);
        if (!data.rating || !data.techId) return;
        addSkill({
          variables: {
            technologyId: data.techId,
            rating: data.rating,
          },
        }).then((result) => {
          console.log(result);
          //refetch();
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
  );
};

export default AddSkill;
