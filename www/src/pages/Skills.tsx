import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthenticationContext";
import axios from 'axios';
import { Form, Button, Select, Rate } from 'antd';
import { Skill } from '@prisma/client';

const Skills = () => {
    const auth = useAuth();
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        const f = async (url: string) => {
            const token = await auth.token()
            if (!token) return '';
            return axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token.idToken}`
                }
            }).then((users) => {
                setSkills(users.data);
            })
        }
        f('/api/skills');
    }, [auth])

    const addSkill = (skill: Skill) => {
        setSkills([...skills, skill])
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
                    <Select.Option value={1}>React</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="rating" label="Rating">
                <Rate count={10} defaultValue={5} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
        { skills && skills.map((skill) => <div>{skill.techId}</div>)}
    </>
};

export default Skills;
