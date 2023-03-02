import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
type UserInfo = Record<string, any>;
type Action =
  | {type: 'setUser'; payload: FirebaseAuthTypes.User | null}
  | {type: 'setUserInfo'; payload: UserInfo | undefined};
type Dispatch = (action: Action) => void;
type State = {
  user: FirebaseAuthTypes.User | null;
  userInfo: UserInfo | null;
  initialized: boolean;
};
type UserProviderProps = {children: ReactNode};

const UserContext = createContext<
  {state: State; dispatch: Dispatch} | undefined
>(undefined);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setUser': {
      return {...state, user: action.payload, initialized: true};
    }
    case 'setUserInfo': {
      return {...state, userInfo: action?.payload ?? null};
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}
const initialState: State = {
  user: null,
  userInfo: null,
  initialized: false,
};

function UserProvider({children}: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const value = {state, dispatch};
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  const {state, dispatch} = context;
  const {user, userInfo, initialized} = state;

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUser =>
      dispatch({type: 'setUser', payload: authUser}),
    );
    return subscriber; // unsubscribe on unmount
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection('usuarios')
        .doc(user.uid)
        .onSnapshot(documentSnapshot =>
          dispatch({
            type: 'setUserInfo',
            payload: documentSnapshot.data(),
          }),
        );
      return subscriber; // unsubscribe on unmount
    }
  }, [dispatch, user]);

  return {user, userInfo, initialized};
}

export {UserProvider, useUser};
