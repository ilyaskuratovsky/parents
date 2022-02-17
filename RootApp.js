import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { goToScreen } from "./Actions";
import * as Controller from "./Controller";
import ErrorScreen from "./ErrorScreen";
import FormationScreen from "./FormationScreen";
import ManageFormationsScreenNew from "./ManageFormationsScreenNew";
//import NewPlayChooseFormation from "./NewPlayChooseFormation";
import PlaybookScreenDraggable from "./PlaybookScreenDraggable";
import PlaybooksListScreen from "./MainScreen";
import PlayScreen from "./PlayScreen.js";
import PlayViewSwiper from "./PlayViewSwiper";
import SplashScreen from "./SplashScreen";
import LoadingScreen from "./unused/LoadingScreen";

function RootApp(props, state) {
  const dispatch = useDispatch();

  useEffect(() => {
    Controller.initializeApp(dispatch);
  }, []);

  const screenWithParams = useSelector((state) => state.screen.screen);
  const screen = screenWithParams.screen;
  //return <CanvasLineTestWorkingMultilineCircle startX={100} startY={100} />;
  //return <SplashScreen />;
  //return <SlideModalTest />;

  if (screen == "LOADING") {
    return (
      <SplashScreen
        appInitializedCallback={() => {
          dispatch(goToScreen({ screen: "MAIN" }));
        }}
        refresh={2200}
      />
    );
  } else if (screen === "PLAY_EDIT") {
    return (
      <PlayScreen
        playId={screenWithParams.playId}
        playbookId={screenWithParams.playbookId}
      />
    );
  } else if (screen === "PLAY") {
    return (
      <PlayViewSwiper
        playId={screenWithParams.playId}
        playbookId={screenWithParams.playbookId}
      />
    );
  } else if (screen === "FORMATION") {
    return (
      <FormationScreen
        formationId={screenWithParams.formationId}
        formationPlaybookId={screenWithParams.formationPlaybookId}
      />
    );
  } else if (screen === "MANAGE_FORMATIONS") {
    return (
      <ManageFormationsScreenNew
        formationPlaybookId={screenWithParams.formationPlaybookId}
      />
    );
  } else if (screen === "PLAYBOOKS_LIST") {
    return <PlaybooksListScreen />;
  } else if (screen === "LOADING") {
    return <LoadingScreen />;
  } else if (screen === "PLAYBOOK") {
    return <PlaybookScreenDraggable playbookId={screenWithParams.playbookId} />;
  } else {
    return <ErrorScreen />;
  }
}

export default RootApp;
