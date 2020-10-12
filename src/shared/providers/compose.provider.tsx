import React from 'react';

interface Props {
  providers: React.FC[];
}

export const Compose: React.FC<Props> = (props) => {
  const { providers = [], children } = props;

  return (
    <React.Fragment>
      {providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
      }, children)}
    </React.Fragment>
  );
};
