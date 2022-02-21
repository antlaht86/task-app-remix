import { Link, useLocation } from "remix";

export const LinkWithQuery = ({ children, to, ...props }: any) => {
  const { search } = useLocation();

  return (
    <Link to={to + search} {...props}>
      {children}
    </Link>
  );
};
