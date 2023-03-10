import Button from "components/elements/Button/Button";
import ErrorMessage from "components/elements/ErrorMessage/ErrorMessage";
import ModalWrap from "components/elements/Modal/Modal";
import ProgressBar from "components/elements/ProgressBar/ProgressBar";
import TournamentAttendantForm from "components/elements/TournamentAttendantForm/TournamentAttendantForm";
import TournamentCreateMetaForm from "components/elements/TournamentCreateMetaForm/TournamentCreateMetaForm";
import TournamentCreateReview from "components/elements/TournamentCreateReview/TournamentCreateReview";
import { DEFAULT_ATTENDANTS_COUNT } from "hardcoded";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import { api } from "utils/api";
import createStringArrayFromNumber from "utils/createStringArrayFromNumber";

const FORM_STEPS = ["Create tournament", "Add tournament attendant", "Review"];

const NewTournamentContainer: FC = () => {
  const router = useRouter();
  const [formStep, setFormStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [attendants, setAttendants] = useState<string[]>(
    createStringArrayFromNumber(DEFAULT_ATTENDANTS_COUNT)
  );
  const { mutateAsync, isLoading, isError } =
    api.tournaments.createTournament.useMutation();

  const isFirstStep = formStep === 0;
  const isLastStep = formStep === FORM_STEPS.length - 1;
  const progress = Math.round((formStep / (FORM_STEPS.length - 1)) * 100);

  const addNewAttendant = () => {
    setAttendants((state) => [...state, ""]);
  };

  const createTournament = async () => {
    const tournament = await mutateAsync({
      attendants,
      name: tournamentName,
    });

    if (!tournament) {
      console.error("error creating tournament");
      return;
    }

    setFormStep(0);
    setIsModalOpen(false);
    setTournamentName("");
    setAttendants(["", "", "", ""]);
    router.push(`/tournaments/${tournament.tournament.id}`).catch(() => {
      console.error("error changing route");
    });
  };

  const isNextStepDisabled = () => {
    if (formStep === 0) {
      return tournamentName.length === 0;
    }

    if (formStep === 1) {
      return attendants.some((attendant) => attendant.length === 0);
    }

    return false;
  };

  return (
    <>
      <Button
        btnColor="outline"
        btnTitle={<span className="px-3 text-sm">New tournament</span>}
        onClick={() => {
          setIsModalOpen((state) => !state);
        }}
      />
      <ModalWrap
        modalWidth="xl"
        isModalVisible={isModalOpen}
        modalTitle="Crete new tournament"
        handleCancelClick={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="h-[30rem]">
          {(() => {
            switch (formStep) {
              case 0:
                return (
                  <TournamentCreateMetaForm
                    tournamentName={tournamentName}
                    setTournamentName={setTournamentName}
                  />
                );

              case 1:
                return (
                  <TournamentAttendantForm
                    attendants={attendants}
                    setAttendants={setAttendants}
                    addNewAttendant={addNewAttendant}
                  />
                );

              case 2:
                return (
                  <TournamentCreateReview
                    attendants={attendants}
                    tournamentName={tournamentName}
                  />
                );

              default:
                return <p>Error</p>;
            }
          })()}
        </div>

        <div className="my-6 w-full">
          {isError ? (
            <div className="flex w-full justify-center">
              <ErrorMessage message="Something went wrong! Please tray again." />
            </div>
          ) : (
            <ProgressBar progress={progress !== 0 ? progress : 5} />
          )}
        </div>

        <div className="flex w-full justify-between">
          <Button
            btnColor="outline"
            btnTitle="Previous"
            isDisabled={isFirstStep}
            onClick={() => {
              if (isFirstStep) {
                return;
              }

              setFormStep((state) => state - 1);
            }}
          />
          <Button
            isLoading={isLoading}
            isDisabled={isNextStepDisabled()}
            btnTitle={isLastStep ? "Create" : "Next"}
            onClick={() => {
              if (isLastStep) {
                createTournament().catch(() => {
                  console.error("Error creating tournament");
                });
                return;
              }

              setFormStep((state) => state + 1);
            }}
          />
        </div>
      </ModalWrap>
    </>
  );
};

export default NewTournamentContainer;
