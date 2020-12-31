import { Ability } from '@casl/ability';
import { Skill } from '@prisma/client';

type Actions = 'create' | 'read' | 'update' | 'delete';
type Subjects = Skill | 'Skill';

const ability = new Ability<[Actions, Subjects]>();
ability.can('read', 'Skill');
ability.cannot('delete', 'Skill');
