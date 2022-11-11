import { memo, FC } from 'react';
import { useMe } from 'hooks/providers/useMe';

type EntryProps = {
  label: string;
  value: string;
};

const Entry = ({ label, value }: EntryProps) => {
  return (
    <>
      <dt>{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {value}
      </dd>
    </>
  );
};

export const Profile: FC = memo(() => {
  const me = useMe();

  return (
    <>
      {/* <Image boxSize="48px" src={imageUrl} alt={login} m="auto" /> */}
      <Entry label="Nick Name" value={me} />
      <Entry label="Role" value="hello" />
      <Entry label="Bio" value="hello" />
    </>
  );
});
