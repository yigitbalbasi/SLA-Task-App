// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package nativemobileactions.proxies;

public class WidgetExport implements com.mendix.systemwideinterfaces.core.IEntityProxy
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject widgetExportMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "NativeMobileActions.WidgetExport";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		String("String"),
		Decimal("Decimal"),
		Enumeration("Enumeration");

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

	public WidgetExport(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, entityName));
	}

	protected WidgetExport(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject widgetExportMendixObject)
	{
		if (widgetExportMendixObject == null) {
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		}
		if (!com.mendix.core.Core.isSubClassOf(entityName, widgetExportMendixObject.getType())) {
			throw new java.lang.IllegalArgumentException(String.format("The given object is not a %s", entityName));
		}	

		this.widgetExportMendixObject = widgetExportMendixObject;
		this.context = context;
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 * @param context The context to be used
	 * @param mendixObject The Mendix object for the new instance
	 * @return a new instance of this proxy class
	 */
	public static nativemobileactions.proxies.WidgetExport initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new nativemobileactions.proxies.WidgetExport(context, mendixObject);
	}

	public static nativemobileactions.proxies.WidgetExport load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return nativemobileactions.proxies.WidgetExport.initialize(context, mendixObject);
	}

	/**
	 * @return value of String
	 */
	public final java.lang.String getString()
	{
		return getString(getContext());
	}

	/**
	 * @param context
	 * @return value of String
	 */
	public final java.lang.String getString(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.String.toString());
	}

	/**
	 * Set value of String
	 * @param string
	 */
	public final void setString(java.lang.String string)
	{
		setString(getContext(), string);
	}

	/**
	 * Set value of String
	 * @param context
	 * @param string
	 */
	public final void setString(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String string)
	{
		getMendixObject().setValue(context, MemberNames.String.toString(), string);
	}

	/**
	 * @return value of Decimal
	 */
	public final java.math.BigDecimal getDecimal()
	{
		return getDecimal(getContext());
	}

	/**
	 * @param context
	 * @return value of Decimal
	 */
	public final java.math.BigDecimal getDecimal(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.math.BigDecimal) getMendixObject().getValue(context, MemberNames.Decimal.toString());
	}

	/**
	 * Set value of Decimal
	 * @param decimal
	 */
	public final void setDecimal(java.math.BigDecimal decimal)
	{
		setDecimal(getContext(), decimal);
	}

	/**
	 * Set value of Decimal
	 * @param context
	 * @param decimal
	 */
	public final void setDecimal(com.mendix.systemwideinterfaces.core.IContext context, java.math.BigDecimal decimal)
	{
		getMendixObject().setValue(context, MemberNames.Decimal.toString(), decimal);
	}

	/**
	 * Get value of Enumeration
	 * @param enumeration
	 */
	public final nativemobileactions.proxies.Enumeration getEnumeration()
	{
		return getEnumeration(getContext());
	}

	/**
	 * @param context
	 * @return value of Enumeration
	 */
	public final nativemobileactions.proxies.Enumeration getEnumeration(com.mendix.systemwideinterfaces.core.IContext context)
	{
		Object obj = getMendixObject().getValue(context, MemberNames.Enumeration.toString());
		if (obj == null) {
			return null;
		}
		return nativemobileactions.proxies.Enumeration.valueOf((java.lang.String) obj);
	}

	/**
	 * Set value of Enumeration
	 * @param enumeration
	 */
	public final void setEnumeration(nativemobileactions.proxies.Enumeration enumeration)
	{
		setEnumeration(getContext(), enumeration);
	}

	/**
	 * Set value of Enumeration
	 * @param context
	 * @param enumeration
	 */
	public final void setEnumeration(com.mendix.systemwideinterfaces.core.IContext context, nativemobileactions.proxies.Enumeration enumeration)
	{
		if (enumeration != null) {
			getMendixObject().setValue(context, MemberNames.Enumeration.toString(), enumeration.toString());
		} else {
			getMendixObject().setValue(context, MemberNames.Enumeration.toString(), null);
		}
	}

	@Override
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return widgetExportMendixObject;
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
			final nativemobileactions.proxies.WidgetExport that = (nativemobileactions.proxies.WidgetExport) obj;
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