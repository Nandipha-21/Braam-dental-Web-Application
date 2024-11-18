// __mocks__/firebase.js
export const getAuth = jest.fn();
export const signInWithEmailAndPassword = jest.fn((auth, email, password) => {
    if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({ user: { uid: '12345' } });
    } else {
        return Promise.reject({ code: 'auth/wrong-password' });
    }
});
export const getDatabase = jest.fn();
export const get = jest.fn();
export const ref = jest.fn();
export const child = jest.fn();