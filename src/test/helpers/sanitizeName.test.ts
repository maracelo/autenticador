import sanitizeName from "../../helpers/sanitizeName";

it('Should return only Test', () =>{
    const name = 'Test<>&\'"/';

    expect(sanitizeName(name)).toBe('Test');
});