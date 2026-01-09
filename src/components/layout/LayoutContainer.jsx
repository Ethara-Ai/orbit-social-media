const LayoutContainer = ({ children, className = '' }) => {
  return (
    <div
      className={`mx-auto w-full max-w-none px-4 lg:px-5 lg:max-w-[calc(var(--spacing)*197.5)] xl:max-w-[calc(var(--spacing)*287.5)] ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default LayoutContainer;
