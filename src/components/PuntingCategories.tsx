export type PuntedCategory =
  | "pts"
  | "ast"
  | "reb"
  | "stl"
  | "blk"
  | "tpm"
  | "fgp"
  | "ftp"
  | "to";

interface PuntingCategoriesProps {
  categories: PuntedCategory[];
  updateCategory: (name: PuntedCategory) => void;
}

interface CheckboxProps extends PuntingCategoriesProps {
  name: PuntedCategory;
}

const Checkbox = ({ categories, updateCategory, name }: CheckboxProps) => {
  return (
    <>
      <input
        onChange={() => updateCategory(name)}
        checked={categories.indexOf(name) > -1}
        type="checkbox"
      />
      <span>{name}</span>
    </>
  );
};

export const PuntingCategories = (props: PuntingCategoriesProps) => {
  return (
    <>
      <Checkbox {...props} name="pts" />
      <Checkbox {...props} name="ast" />
      <Checkbox {...props} name="reb" />
      <Checkbox {...props} name="stl" />
      <Checkbox {...props} name="blk" />
      <Checkbox {...props} name="tpm" />
      <Checkbox {...props} name="fgp" />
      <Checkbox {...props} name="ftp" />
      <Checkbox {...props} name="to" />
    </>
  );
};
