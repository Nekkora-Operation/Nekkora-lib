import { Option, OptionGroup, Select } from 'nekkora-lib';

export default function SelectChildren() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Select label="Agente" placeholder="Selecione um agente" leftIcon="monitor">
        <OptionGroup label="Windows Server">
          <Option value="agt-01">AGT-01 · Server 2022</Option>
          <Option value="agt-03">AGT-03 · Server 2019</Option>
        </OptionGroup>
        <OptionGroup label="Desktop">
          <Option value="agt-02">AGT-02 · Windows 11</Option>
          <Option value="agt-04" disabled>AGT-04 · Offline</Option>
        </OptionGroup>
      </Select>
    </div>
  );
}
