import { useReducer } from "react";

export function reducer(state, action)
{
  switch (action.type)
  {
    // ui
    case 'menuHidden'      : return { ...state, isMenuHidden      : !state.isMenuHidden       };
    case 'dashboardMoved'  : return { ...state, isDashboardMoved  : !state.isDashboardMoved   };
    case 'searchbarSpaced' : return { ...state, isSearchbarSpaced : !state.isSearchbarSpaced  };
    case 'projCreatorShown': return { ...state, isProjCreatorShown: !state.isProjCreatorShown };

    

    case 'taskUpdated': return { ...state, isTaskUpdated: !state.isTaskUpdated };
    default: return state;
  }
}

export const [state, dispatch] = useReducer(reducer, 
{
  isMenuHidden: false,
  isDashboardMoved: false,
  isSearchbarSpaced: false,
  isProjCreatorShown: false,

  isTaskUpdated: false
});
