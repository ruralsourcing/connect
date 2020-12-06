import Session from '../Session';

test('should exist', () => {
    let s = new Session('1', '2');
    expect(s.teamId).toEqual('1')
})
