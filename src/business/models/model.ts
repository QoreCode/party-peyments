export default abstract class Model {
  protected abstract _uid: string;

  public abstract get uid(): string;
}
