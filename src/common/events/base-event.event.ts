export abstract class BaseEvent {
  static get eventName(): symbol {
    throw new Error(
      'METHOD_NOT_IMPLEMENTED: eventName must be implemented in derived classes of BaseEvent',
    );
  }
}
