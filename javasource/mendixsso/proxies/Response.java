// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package mendixsso.proxies;

public class Response implements com.mendix.systemwideinterfaces.core.IEntityProxy
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject responseMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "MendixSSO.Response";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Success("Success"),
		Error("Error"),
		ErrorDescription("ErrorDescription");

		private final java.lang.String metaName;

		MemberNames(java.lang.String s)
		{
			metaName = s;
		}

		@java.lang.Override
		public java.lang.String toString()
		{
			return metaName;
		}
	}

	public Response(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, entityName));
	}

	protected Response(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject responseMendixObject)
	{
		if (responseMendixObject == null) {
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		}
		if (!com.mendix.core.Core.isSubClassOf(entityName, responseMendixObject.getType())) {
			throw new java.lang.IllegalArgumentException(String.format("The given object is not a %s", entityName));
		}	

		this.responseMendixObject = responseMendixObject;
		this.context = context;
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 * @param context The context to be used
	 * @param mendixObject The Mendix object for the new instance
	 * @return a new instance of this proxy class
	 */
	public static mendixsso.proxies.Response initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new mendixsso.proxies.Response(context, mendixObject);
	}

	public static mendixsso.proxies.Response load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return mendixsso.proxies.Response.initialize(context, mendixObject);
	}

	/**
	 * @return value of Success
	 */
	public final java.lang.Boolean getSuccess()
	{
		return getSuccess(getContext());
	}

	/**
	 * @param context
	 * @return value of Success
	 */
	public final java.lang.Boolean getSuccess(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Boolean) getMendixObject().getValue(context, MemberNames.Success.toString());
	}

	/**
	 * Set value of Success
	 * @param success
	 */
	public final void setSuccess(java.lang.Boolean success)
	{
		setSuccess(getContext(), success);
	}

	/**
	 * Set value of Success
	 * @param context
	 * @param success
	 */
	public final void setSuccess(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Boolean success)
	{
		getMendixObject().setValue(context, MemberNames.Success.toString(), success);
	}

	/**
	 * @return value of Error
	 */
	public final java.lang.String getError()
	{
		return getError(getContext());
	}

	/**
	 * @param context
	 * @return value of Error
	 */
	public final java.lang.String getError(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Error.toString());
	}

	/**
	 * Set value of Error
	 * @param error
	 */
	public final void setError(java.lang.String error)
	{
		setError(getContext(), error);
	}

	/**
	 * Set value of Error
	 * @param context
	 * @param error
	 */
	public final void setError(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String error)
	{
		getMendixObject().setValue(context, MemberNames.Error.toString(), error);
	}

	/**
	 * @return value of ErrorDescription
	 */
	public final java.lang.String getErrorDescription()
	{
		return getErrorDescription(getContext());
	}

	/**
	 * @param context
	 * @return value of ErrorDescription
	 */
	public final java.lang.String getErrorDescription(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.ErrorDescription.toString());
	}

	/**
	 * Set value of ErrorDescription
	 * @param errordescription
	 */
	public final void setErrorDescription(java.lang.String errordescription)
	{
		setErrorDescription(getContext(), errordescription);
	}

	/**
	 * Set value of ErrorDescription
	 * @param context
	 * @param errordescription
	 */
	public final void setErrorDescription(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String errordescription)
	{
		getMendixObject().setValue(context, MemberNames.ErrorDescription.toString(), errordescription);
	}

	@Override
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return responseMendixObject;
	}

	@Override
	public final com.mendix.systemwideinterfaces.core.IContext getContext()
	{
		return context;
	}

	@java.lang.Override
	public boolean equals(Object obj)
	{
		if (obj == this) {
			return true;
		}
		if (obj != null && getClass().equals(obj.getClass()))
		{
			final mendixsso.proxies.Response that = (mendixsso.proxies.Response) obj;
			return getMendixObject().equals(that.getMendixObject());
		}
		return false;
	}

	@java.lang.Override
	public int hashCode()
	{
		return getMendixObject().hashCode();
	}

  /**
   * Gives full name ("Module.Entity" name) of the type of the entity.
   *
   * @return the name
   */
	public static java.lang.String getType()
	{
		return entityName;
	}
}