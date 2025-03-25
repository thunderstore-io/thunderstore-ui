type TaskAction<Args, Res> = (
  args: Args,
  controller: AbortController
) => Promise<Res>;

function chainActions<T1, T2, T3>(
  act1: TaskAction<T1, T2>,
  act2: TaskAction<T2, T3>
): TaskAction<T1, T3> {
  return async (args, controller) => {
    return await act2(await act1(args, controller), controller);
  };
}
