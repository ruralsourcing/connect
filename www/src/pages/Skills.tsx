import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Select, Rate } from 'antd';
import { Skill, Tech } from '@prisma/client';

import { gql, useQuery } from '@apollo/client';

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

const GET_TECH = gql`
    query technologies {
    id
    name
  }
`;



const Skills = () => {
    const [tech, setTech] = useState<Tech[]>();
    // const [skills, setSkills] = useState<Skill[]>();
    const { loading, error, data } = useQuery(GET_SKILLS);

    useEffect(() => {
        axios.get('/api/tech').then((tech) => {
            setTech(tech.data)
        })
    }, [])

    // useEffect(() => {
    //     axios.get('/api/user/skills').then((userSkills) => {
    //         setSkills(userSkills.data);
    //     })
    // }, [])

    const addSkill = (skill: Skill) => {
        //setSkills([...skills, skill])
    }

    // if (loading) return 'Loading...';
    // if (error) return `Error! ${ error.message } `;

    return (
        <>
            <h1>Skills</h1>
            <Form
                onFinish={addSkill}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal">
                <Form.Item name="techId" label="Technology">
                    <Select disabled={!tech}>
                        {tech && tech.map((t) => <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="rating" label="Rating">
                    <Rate count={10} defaultValue={5} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            {
                (loading && <div>Loading...</div>) ||
                (error && <div>Error! ${error.message}`</div >) ||
                (data && data.skills.map((skill: {
                    rating: Number,
                    technology: {
                        name: string
                    }
                }) => <div>User Skill {skill.technology?.name} with rating {skill.rating}</div>))
            }
        </>
    )
};

export default Skills;
