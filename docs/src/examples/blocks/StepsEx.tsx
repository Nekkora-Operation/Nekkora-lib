import { Steps } from 'nekkora-lib';

export default function StepsEx() {
  return (
    <Steps
      items={[
        { icon: 'message', title: 'Entendemos', description: 'Levantamos o processo.' },
        { icon: 'studio', title: 'Estruturamos', description: 'Desenho e documentação.' },
        { icon: 'server', title: 'Executamos', description: 'Ambiente operado.' },
        { icon: 'pulse', title: 'Monitoramos', description: 'Execuções e falhas.' },
      ]}
    />
  );
}
