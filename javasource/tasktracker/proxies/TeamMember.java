// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package tasktracker.proxies;

public class TeamMember implements com.mendix.systemwideinterfaces.core.IEntityProxy
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject teamMemberMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "TaskTracker.TeamMember";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Name("Name"),
		PhoneNumber("PhoneNumber"),
		Email("Email"),
		BirthDay("BirthDay"),
		TeamMember_Department("TaskTracker.TeamMember_Department");

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

	public TeamMember(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, entityName));
	}

	protected TeamMember(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject teamMemberMendixObject)
	{
		if (teamMemberMendixObject == null) {
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		}
		if (!com.mendix.core.Core.isSubClassOf(entityName, teamMemberMendixObject.getType())) {
			throw new java.lang.IllegalArgumentException(String.format("The given object is not a %s", entityName));
		}	

		this.teamMemberMendixObject = teamMemberMendixObject;
		this.context = context;
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 * @param context The context to be used
	 * @param mendixObject The Mendix object for the new instance
	 * @return a new instance of this proxy class
	 */
	public static tasktracker.proxies.TeamMember initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new tasktracker.proxies.TeamMember(context, mendixObject);
	}

	public static tasktracker.proxies.TeamMember load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return tasktracker.proxies.TeamMember.initialize(context, mendixObject);
	}

	public static java.util.List<tasktracker.proxies.TeamMember> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		return com.mendix.core.Core.createXPathQuery(String.format("//%1$s%2$s", entityName, xpathConstraint))
			.execute(context)
			.stream()
			.map(obj -> tasktracker.proxies.TeamMember.initialize(context, obj))
			.collect(java.util.stream.Collectors.toList());
	}

	/**
	 * @return value of Name
	 */
	public final java.lang.String getName()
	{
		return getName(getContext());
	}

	/**
	 * @param context
	 * @return value of Name
	 */
	public final java.lang.String getName(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Name.toString());
	}

	/**
	 * Set value of Name
	 * @param name
	 */
	public final void setName(java.lang.String name)
	{
		setName(getContext(), name);
	}

	/**
	 * Set value of Name
	 * @param context
	 * @param name
	 */
	public final void setName(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String name)
	{
		getMendixObject().setValue(context, MemberNames.Name.toString(), name);
	}

	/**
	 * @return value of PhoneNumber
	 */
	public final java.lang.String getPhoneNumber()
	{
		return getPhoneNumber(getContext());
	}

	/**
	 * @param context
	 * @return value of PhoneNumber
	 */
	public final java.lang.String getPhoneNumber(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.PhoneNumber.toString());
	}

	/**
	 * Set value of PhoneNumber
	 * @param phonenumber
	 */
	public final void setPhoneNumber(java.lang.String phonenumber)
	{
		setPhoneNumber(getContext(), phonenumber);
	}

	/**
	 * Set value of PhoneNumber
	 * @param context
	 * @param phonenumber
	 */
	public final void setPhoneNumber(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String phonenumber)
	{
		getMendixObject().setValue(context, MemberNames.PhoneNumber.toString(), phonenumber);
	}

	/**
	 * @return value of Email
	 */
	public final java.lang.String getEmail()
	{
		return getEmail(getContext());
	}

	/**
	 * @param context
	 * @return value of Email
	 */
	public final java.lang.String getEmail(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Email.toString());
	}

	/**
	 * Set value of Email
	 * @param email
	 */
	public final void setEmail(java.lang.String email)
	{
		setEmail(getContext(), email);
	}

	/**
	 * Set value of Email
	 * @param context
	 * @param email
	 */
	public final void setEmail(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String email)
	{
		getMendixObject().setValue(context, MemberNames.Email.toString(), email);
	}

	/**
	 * @return value of BirthDay
	 */
	public final java.util.Date getBirthDay()
	{
		return getBirthDay(getContext());
	}

	/**
	 * @param context
	 * @return value of BirthDay
	 */
	public final java.util.Date getBirthDay(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.util.Date) getMendixObject().getValue(context, MemberNames.BirthDay.toString());
	}

	/**
	 * Set value of BirthDay
	 * @param birthday
	 */
	public final void setBirthDay(java.util.Date birthday)
	{
		setBirthDay(getContext(), birthday);
	}

	/**
	 * Set value of BirthDay
	 * @param context
	 * @param birthday
	 */
	public final void setBirthDay(com.mendix.systemwideinterfaces.core.IContext context, java.util.Date birthday)
	{
		getMendixObject().setValue(context, MemberNames.BirthDay.toString(), birthday);
	}

	/**
	 * @throws com.mendix.core.CoreException
	 * @return value of TeamMember_Department
	 */
	public final tasktracker.proxies.Department getTeamMember_Department() throws com.mendix.core.CoreException
	{
		return getTeamMember_Department(getContext());
	}

	/**
	 * @param context
	 * @return value of TeamMember_Department
	 * @throws com.mendix.core.CoreException
	 */
	public final tasktracker.proxies.Department getTeamMember_Department(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		tasktracker.proxies.Department result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.TeamMember_Department.toString());
		if (identifier != null) {
			result = tasktracker.proxies.Department.load(context, identifier);
		}
		return result;
	}

	/**
	 * Set value of TeamMember_Department
	 * @param teammember_department
	 */
	public final void setTeamMember_Department(tasktracker.proxies.Department teammember_department)
	{
		setTeamMember_Department(getContext(), teammember_department);
	}

	/**
	 * Set value of TeamMember_Department
	 * @param context
	 * @param teammember_department
	 */
	public final void setTeamMember_Department(com.mendix.systemwideinterfaces.core.IContext context, tasktracker.proxies.Department teammember_department)
	{
		if (teammember_department == null) {
			getMendixObject().setValue(context, MemberNames.TeamMember_Department.toString(), null);
		} else {
			getMendixObject().setValue(context, MemberNames.TeamMember_Department.toString(), teammember_department.getMendixObject().getId());
		}
	}

	@Override
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return teamMemberMendixObject;
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
			final tasktracker.proxies.TeamMember that = (tasktracker.proxies.TeamMember) obj;
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