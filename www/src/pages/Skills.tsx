import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthenticationContext";
import axios from 'axios';

interface User {
    email?: string;
}

const Skills = () => {
    const auth = useAuth();
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        const f = async (url: string) => {
            const token = await auth.token()
            if (!token) return '';
            // return await fetch(url, {
            //     headers: {
            //         Authorization: `Bearer ${token.idToken}`
            //     }
            // }).then(r => r.json());
            return axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token.idToken}`
                }
            }).then((users) => {
                setUsers(users.data);
            })
        }
        f('/users').then(console.log);
    }, [auth])
    return <>
        <h1>Skills</h1>
        { users && users.map((user) => <div>{user.email}</div>)}
    </>
};

export default Skills;
