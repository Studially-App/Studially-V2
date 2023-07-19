import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserTier = 'premium' | undefined;
type UserInfo = Record<string, any>;
type Action =
  | {type: 'setUser'; payload: FirebaseAuthTypes.User | null}
  | {type: 'setUserInfo'; payload: UserInfo | undefined}
  | {type: 'setUserTier'; payload: UserTier};
type Dispatch = (action: Action) => void;
type State = {
  user: FirebaseAuthTypes.User | null;
  userInfo: UserInfo | null;
  userTier: UserTier;
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
    case 'setUserTier': {
      return {...state, userTier: action.payload};
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
  userTier: undefined,
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
  const {user, userInfo, initialized, userTier} = state;

  const getCustomClaimRole = useCallback(async () => {
    if (user) {
      await auth().currentUser!.getIdToken(true);
      const decodedToken = await auth().currentUser!.getIdTokenResult();
      return decodedToken.claims.stripeRole;
    }
    return undefined;
  }, [user]);

  const refreshTier = useCallback(async () => {
    if (user) {
      try {
        const customerDocRef = firestore().collection('customers').doc(user.uid);
        const customerDoc = await customerDocRef.get();
    
        if (customerDoc.exists) {
          const customerData = customerDoc.data();
          if (customerData && customerData.customerId) {
            await AsyncStorage.setItem('userTier', 'premium');
            dispatch({type: 'setUserTier', payload: 'premium'});
          } else {
            // No active subscription found, clear tier data
            await AsyncStorage.removeItem('userTier');
            dispatch({type: 'setUserTier', payload: undefined});
          }
        } else {
          const response = await axios.get(`https://api.stripe.com/v1/customers/search?query=email:"${user.email}"`, {
            headers: {
              Authorization: `Bearer sk_test_51Me4GBAX9PxeRGsUcXVYs9jj1HwRDFG1SQsPlI4ZTkfytB3jXlJWtPty8MOQ8log9AXbpBwGaZ3CoaMNhewJu20l008rwHc7yW`
            }
          });
    
          if (response.status === 200 && response.data && response.data.data.length > 0) {
            const customerId = response.data.data[0].id;
            await customerDocRef.set({
              customerId,
            }, { merge: true });
    
            await AsyncStorage.setItem('userTier', 'premium');
            dispatch({type: 'setUserTier', payload: 'premium'});
          } else {
            // No active subscription found, clear tier data
            await AsyncStorage.removeItem('userTier');
            dispatch({type: 'setUserTier', payload: undefined});
          }
        }
      } catch (error) {
        console.log('Error al verificar el código referido:', error);
      }
    }
  }, [user, dispatch]);

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

  useEffect(() => {
    getCustomClaimRole().then(role =>
      dispatch({type: 'setUserTier', payload: role}),
    );
  }, [dispatch, getCustomClaimRole]);

  useEffect(() => {
    refreshTier();
  }, [refreshTier]);

  return {
    user,
    userInfo,
    initialized,
    userTier,
    refreshTier,
  };
}

export {UserProvider, useUser};
