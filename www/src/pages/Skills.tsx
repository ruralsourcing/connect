import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthenticationContext";
import axios from 'axios';
import { Form, Button, Select, Rate } from 'antd';
import { Skill, Tech } from '@prisma/client';



const Skills = () => {
    const [tech, setTech] = useState<Tech[]>();
    const [userSkills, setUserSkills] = useState<Skill[]>();

    useEffect(() => {
        axios.get('/api/tech').then((tech) => {
            setTech(tech.data)
        })
    }, [])

    useEffect(() => {
        axios.get('/api/user/skills').then((userSkills) => {
            setUserSkills(userSkills.data);
        })
    }, [])

    const addSkill = (skill: Skill) => {
        //setSkills([...skills, skill])
    }

    return <>
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
                <Select>
                    {tech && tech.map((t) => <Select.Option value={t.id}>{t.name}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="rating" label="Rating">
                <Rate count={10} defaultValue={5} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
        { userSkills && userSkills.map((skill) => <div>{skill.rating}</div>)}
    </>
};

export default Skills;
