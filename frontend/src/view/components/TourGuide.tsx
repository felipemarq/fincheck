import { useState, useEffect } from 'react';
import Joyride, { EVENTS, STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

interface TourGuideProps {
  start: boolean;
  setStartTour: (value: boolean) => void;
  onTourEnd: () => void;
  onFabOpen: () => void;
  onFabClose: () => void;
}

interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}

export const TourGuide = ({
  onTourEnd,
  setStartTour,
  start,
  onFabClose,
  onFabOpen,
}: TourGuideProps) => {
  const [progress, setProgress] = useState(1);
  const totalSteps = 5;

  const generateStepts = (val: number): Step[] => [
    {
      content: (
        <div className="p-4 max-w-md text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            Atenção: Versão Inicial
          </h1>
          <p className="text-lg text-white mb-4">
            Esta é uma versão extremamente inicial do Fincheck, ainda em fase de
            desenvolvimento.
          </p>
          <p className="text-lg text-white mb-4">
            Bugs podem e irão acontecer, e muitas funcionalidades ainda estão em
            estágios bem iniciais.
          </p>
          <p className="text-lg text-white mb-4">
            Contamos com a sua compreensão e paciência enquanto trabalhamos para
            melhorar cada detalhe!
          </p>
          <p className="text-sm text-neutral-400">
            Passo {val} de {totalSteps}
          </p>
        </div>
      ),
      locale: {
        skip: 'Pular',
        next: 'Próximo',
        back: 'Voltar',
        last: 'Último',
        close: 'Fechar',
      },
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div className="p-4 max-w-md text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Bem-vindo ao Fincheck!
          </h1>
          <p className="text-lg text-white'1 mb-4">
            Aqui você terá uma visão geral sobre como navegar e utilizar nossa
            aplicação de finanças.
          </p>
          <p className="text-sm text-neutral-400">
            Passo {val} de {totalSteps}
          </p>
        </div>
      ),
      locale: {
        skip: 'Pular',
        next: 'Próximo',
        back: 'Voltar',
        last: 'Último',
        close: 'Fechar',
      },
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <p className="text-4xl">Fincheck! 2</p>
        </div>
      ),
      locale: {
        skip: 'Pular',
        next: 'Próximo',
        back: 'Voltar',
        last: 'Último',
        close: 'Fechar',
      },
      target: '.react-joyride-target',
    },
    {
      content: (
        <div>
          <p className="text-4xl">Fincheck! 2</p>
        </div>
      ),
      locale: {
        skip: 'Pular',
        next: 'Próximo',
        back: 'Voltar',
        last: 'Último',
        close: 'Fechar',
      },
      target: '.react-joyride-target',
    },
    {
      content: (
        <div>
          <p className="text-4xl">Fincheck! 2</p>
        </div>
      ),
      locale: {
        skip: 'Pular',
        next: 'Próximo',
        back: 'Voltar',
        last: 'Último',
        close: 'Fechar',
      },
      target: '.react-joyride-target-2',
    },
  ];

  const [{ run, steps }, setState] = useState<State>({
    run: start,
    stepIndex: 0,
    steps: generateStepts(progress),
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      steps: generateStepts(progress),
    }));
  }, [progress]);

  useEffect(() => {
    if (start) {
      setState((prevState) => ({ ...prevState, run: true, stepIndex: 0 }));
    }
  }, [start]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    console.log('Joyride callback', data);

    if (type === EVENTS.STEP_BEFORE && index === 2) {
      // Abre o Fab no passo 3
      onFabOpen();
    } else if (type === EVENTS.STEP_AFTER && index === 2) {
      // Fecha o Fab ao prosseguir
      onFabClose();
    }

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setState({ steps, run: false, stepIndex: 0 });
      setStartTour(false);
      onTourEnd();
    } else if (([EVENTS.STEP_BEFORE] as string[]).includes(type)) {
      setProgress(index + 1);
    }
  };
  return (
    <Joyride
      continuous
      callback={handleJoyrideCallback}
      run={run}
      steps={steps}
      scrollToFirstStep
      hideCloseButton={false}
      disableCloseOnEsc
      disableOverlayClose
      spotlightPadding={10}
      showProgress
      showSkipButton
      debug
      styles={{
        overlay: {
          border: '6px solid lightblue',
        },
        spotlight: {
          border: '2px solid lightblue',
        },
        buttonClose: {
          marginTop: '5px',
          marginRight: '5px',
          width: '12px',
        },
        buttonNext: {
          outline: '2px solid transparent',
          outlineOffset: '2px',
          backgroundColor: '#087F5B',
          borderRadius: '5px',
          color: '#FFFFFF',
        },
        buttonSkip: {
          color: 'A3A3A3',
        },
        tooltipFooter: {
          margin: '0px 16px 10px 10px',
        },
        buttonBack: {
          outline: '2px solid transparent',
          outlineOffset: '2px',
        },
        options: {
          zIndex: 100,
          arrowColor: '#1F1F1F',
          backgroundColor: '#1F1F1F',
          textColor: '#FFFFFF',
          overlayColor: 'rgba(0, 0, 0, 0.9)',
          primaryColor: '#087F5B',
        },
      }}
      locale={{
        back: (
          <p className="font-bold focus:ring-transparent focus-visible:outline-none">
            {`<-`}
          </p>
        ),
      }}
    />
  );
};
